# Family service illustrations

Created with the built-in imagegen tool. Final assets are transparent WebP files in `public/services/`, compressed with Sharp for web delivery. Existing layouts, card dimensions and CSS are retained.

Service illustrations are limited to 1024 pixels wide and a 90 KiB file budget. Transparency is encoded losslessly. Logos are resized to 640 pixels wide, sufficient for their current display sizes. Next.js Image continues to serve responsive sizes and lazy-load images below the fold.

Shared prompt: polished, friendly soft 3D clay illustration for an Indian family services website; warm natural skin tones, powder blue, butter yellow and coral; centered isolated vignette with transparent background; no text, logos or watermark. Show people using the service rather than products for sale.

| Asset                         | Scene prompt                                                                                                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preschool-daycare.webp`      | Preschool teacher and two children learning shapes at a low round table.                                                                                                                                                        |
| `classes-activities-art.webp` | One art teacher and one child painting at a table. Teacher has exactly two arms and two hands, both resting separately on the table. Child holds a brush with one hand and rests the other on the table. No clapping or waving. |
| `play-entertainment.webp`     | Two children enjoying a small slide and soft-play tunnel, with an attentive adult nearby.                                                                                                                                       |
| `birthday-events.webp`        | Parent and two children celebrating around a birthday cake and pastel balloon arch.                                                                                                                                             |
| `babysitting-nannies.webp`    | Caring nanny reading a picture book with a toddler and another child.                                                                                                                                                           |
| `health-development.webp`     | Child development professional talking with a parent and child during a milestone consultation.                                                                                                                                 |

The activities illustration was regenerated after an extra hand was identified in the original. The final replacement uses a simple seated pose with both teacher hands visible on the table.

The service-neutral Zapiboo wordmark is retained in `src/assets/zapiboo-brand.webp`. Product category images, vehicle images, collection photos, duplicate logos and unused selling/vehicle/repair components were removed. Historical request readers and database migrations remain to preserve existing records.
