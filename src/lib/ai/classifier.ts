import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface ClassificationResult {
  title: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  confidence: number;
}

/**
 * تصنيف ذكي للبلاغ باستخدام GPT-4o-mini
 */
export async function classifyReport(
  content: string,
  mediaUrls: string[]
): Promise<ClassificationResult> {
  try {
    const systemPrompt = `أنت مساعد ذكي متخصص في تصنيف بلاغات الصيانة للمدارس.
حلل الوصف والصور (إن وجدت) وحدد:
1. عنوان مختصر للبلاغ
2. فئة الصيانة (ELECTRICAL, PLUMBING, HVAC, CARPENTRY, PAINTING, CLEANING, SECURITY, IT, FURNITURE, OTHER)
3. مستوى الأولوية (LOW, MEDIUM, HIGH, URGENT)

قواعد الأولوية:
- URGENT: خطر على السلامة (كهرباء، غاز، فيضان، كسر زجاج، باب مقفل)
- HIGH: يؤثر على التعليم (تكييف معطل، إنترنت مقطوع، إضاءة فصل)
- MEDIUM: إزعاج (صنبور متسرب، باب يصدر صوت)
- LOW: تحسين (دهان، تنظيم)

رد فقط بـ JSON:`;

    const userPrompt = `الوصف: "${content}"\n${mediaUrls.length > 0 ? `عدد الصور المرفقة: ${mediaUrls.length}` : ''}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      title: result.title || 'بلاغ صيانة',
      category: result.category || 'OTHER',
      priority: result.priority || 'MEDIUM',
      confidence: result.confidence || 0.8
    };
  } catch (error) {
    console.error('AI classification error:', error);
    return fallbackClassify(content);
  }
}

/**
 * تصنيف احتياطي بدون AI
 */
function fallbackClassify(content: string): ClassificationResult {
  const text = content.toLowerCase();

  let category = 'OTHER';
  let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';

  if (text.includes('كهرب') || text.includes('فيش') || text.includes('لمبة') || text.includes('كابل')) {
    category = 'ELECTRICAL';
    if (text.includes('شرارة') || text.includes('دخان') || text.includes('حريق')) priority = 'URGENT';
  } else if (text.includes('سباكة') || text.includes('ماء') || text.includes('صنبور') || text.includes('تسرب')) {
    category = 'PLUMBING';
    if (text.includes('فيضان') || text.includes('غمر')) priority = 'URGENT';
  } else if (text.includes('تكييف') || text.includes('مكيف') || text.includes('تبريد')) {
    category = 'HVAC';
    priority = 'HIGH';
  } else if (text.includes('نجارة') || text.includes('باب') || text.includes('شباك')) {
    category = 'CARPENTRY';
  } else if (text.includes('دهان') || text.includes('طلاء') || text.includes('لون')) {
    category = 'PAINTING';
    priority = 'LOW';
  } else if (text.includes('نظافة') || text.includes('قمامة') || text.includes('تنظيف')) {
    category = 'CLEANING';
    priority = 'LOW';
  } else if (text.includes('أمن') || text.includes('كاميرا') || text.includes('حماية')) {
    category = 'SECURITY';
  } else if (text.includes('انترنت') || text.includes('شبكة') || text.includes('واي فاي') || text.includes('كمبيوتر')) {
    category = 'IT';
    priority = 'HIGH';
  }

  return {
    title: `بلاغ ${getCategoryLabel(category)}`,
    category,
    priority,
    confidence: 0.5
  };
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ELECTRICAL: 'كهرباء', PLUMBING: 'سباكة', HVAC: 'تكييف',
    CARPENTRY: 'نجارة', PAINTING: 'دهان', CLEANING: 'نظافة',
    SECURITY: 'أمن', IT: 'تقنية معلومات', FURNITURE: 'أثاث', OTHER: 'أخرى'
  };
  return labels[category] || category;
}