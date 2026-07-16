# دليل ربط Twilio WhatsApp Sandbox

## الخطوة 1: إنشاء حساب Twilio
1. ادخل على https://www.twilio.com/try-twilio
2. سجل حساب جديد (يمكنك استخدام البريد المؤقت)
3. أكد رقم الهاتف

## الخطوة 2: تفعيل WhatsApp Sandbox
1. من لوحة التحكم: Messaging > Try it out > Send WhatsApp
2. اختر "Sandbox"
3. احفظ:
   - Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   - Auth Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   - WhatsApp Number: +14155238886

## الخطوة 3: ربط رقمك
أرسل رسالة WhatsApp من هاتفك إلى:
```
+1 415 523 8886
```
المحتوى:
```
join aboard-needs
```

## الخطوة 4: إضافة الإعدادات في المنصة
1. ادخل على صفحة "الإعدادات" في المنصة
2. في قسم WhatsApp:
   - Account SID: أدخل القيمة من Twilio
   - Auth Token: أدخل القيمة من Twilio
   - فعّل "تفعيل WhatsApp"

## الخطوة 5: اختبار
1. أرسل رسالة WhatsApp إلى الرقم
2. يجب أن تظهر في صفحة البلاغات تلقائياً

## ملاحظات مهمة
- Sandbox مجاني لـ 1000 رسالة/شهر
- للإنتاج، تحتاج لشراء رقم WhatsApp Business API
- يمكنك إضافة أرقام مشرفين من صفحة القوى العاملة
