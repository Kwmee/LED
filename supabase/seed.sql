insert into public.panels (id, brand, model, width_mm, height_mm, pixel_width, pixel_height, pitch)
values
  ('panel-roe-bm2', 'ROE', 'Black Marble 2.6', 500, 500, 192, 192, 2.60),
  ('panel-absen-pl25', 'Absen', 'PL2.5 Pro', 500, 500, 200, 200, 2.50),
  ('panel-unilumin-upadiii', 'Unilumin', 'UPADIII 3.9', 500, 500, 128, 128, 3.90)
on conflict (id) do nothing;

insert into public.processors (id, brand, model, max_pixels, ports, pixels_per_port)
values
  ('proc-novastar-mx40', 'NovaStar', 'MX40 Pro', 10000000, 20, 650000),
  ('proc-brompton-s8', 'Brompton', 'S8', 5300000, 8, 650000),
  ('proc-colorlight-z6', 'Colorlight', 'Z6 Pro', 8800000, 12, 650000)
on conflict (id) do nothing;
