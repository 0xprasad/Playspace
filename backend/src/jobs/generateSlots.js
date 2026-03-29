import { query } from '../db/mysql.js';

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export async function generateSlotsForNextSevenDays() {
  const templates = await query(
    `SELECT id, ground_id, day_of_week, start_time, end_time, duration_mins, price
       FROM slot_templates
      WHERE is_active = TRUE`
  );

  const today = new Date();

  for (let i = 0; i < 7; i += 1) {
    const target = new Date(today);
    target.setUTCDate(today.getUTCDate() + i);
    const dateString = formatDate(target);
    const weekday = target.getUTCDay();

    for (const template of templates) {
      if (template.day_of_week !== weekday) {
        continue;
      }

      await query(
        `INSERT IGNORE INTO ground_slots (ground_id, date, start_time, end_time, price)
         VALUES (?, ?, ?, ?, ?)`,
        [template.ground_id, dateString, template.start_time, template.end_time, template.price]
      );
    }
  }
}
