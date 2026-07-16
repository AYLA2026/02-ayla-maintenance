# آيلا - منصة الصيانة الذكية

## نظام إدارة الصيانة المتكامل للمدارس

### المميزات
- ✅ إدارة متعددة المشاريع
- ✅ بلاغات صيانة (واتساب + تعليم + AI)
- ✅ جدولة صيانة دورية
- ✅ إدارة القوى العاملة والإقامات
- ✅ مخازن ومواد
- ✅ مركبات وتأمين
- ✅ تقارير (نظافة، O&M، تكييف، مصور)
- ✅ تحليل مالي
- ✅ إعدادات WhatsApp وAI

### التقنيات
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Recharts
- Twilio WhatsApp

### التشغيل
```bash
npm install
npm run dev
```

### قاعدة البيانات
```bash
psql -U postgres -d ayla_db -f database/ayla_schema.sql
```

### المتغيرات البيئية
```
DATABASE_URL=postgresql://user:password@localhost:5432/ayla_db
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### المساهمون
- فريق آيلا للحلول الرقمية
