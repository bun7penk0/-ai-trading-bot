AI Trading Bot v0.5.2
SIM MODE เป็นค่าเริ่มต้น — ไม่ส่งคำสั่งจริง ถ้าไม่ตั้งค่า API key

Deploy บน Vercel (5 นาที)
สร้าง repo GitHub ใหม่ชื่อ ai-trading-bot
อัพโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ (รวม api/)
Vercel → Add New Project → Import repo → Deploy - Framework Preset: Other
เสร็จ — เปิด URL ที่ได้ ใช้งาน SIM ได้ทันที
เปิดใช้ LIVE (Alpaca Paper Trading — ฟรี ไม่ใช้เงินจริง)
สมัคร https://alpaca.markets → สร้าง Paper Account
คัดลอก API Key + Secret (โหมด Paper)
Vercel → Project → Settings → Environment Variables ใส่: ALPACA_KEY, ALPACA_SECRET, ALPACA_PAPER=true
Redeploy
เรียก /api/account ควรได้ { "mode": "LIVE", ... }
ความปลอดภัย
API key อยู่ฝั่ง server เท่านั้น ไม่หลุดไป browser
Safety checks ฝั่ง server: AMD > $400, NFLX < $400 → block
ALPACA_PAPER=true เป็น default
คำเตือน
การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินลงทุนทั้งหมด

