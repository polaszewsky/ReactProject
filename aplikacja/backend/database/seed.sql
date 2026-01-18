INSERT INTO cars (brand, model, year, category, price_per_day, image_url, available, features, seats, transmission, fuel_type) VALUES
('Toyota', 'Camry', 2023, 'sedan', 250.00, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', true, 
 ARRAY['GPS', 'Klimatyzacja', 'Bluetooth', 'Kamera cofania'], 5, 'Automatyczna', 'Hybryda'),

('BMW', '5 Series', 2024, 'sedan', 450.00, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', true,
 ARRAY['GPS', 'Klimatyzacja', 'Skórzane fotele', 'Tempomat adaptacyjny', 'Apple CarPlay'], 5, 'Automatyczna', 'Diesel'),

('Mercedes-Benz', 'E-Class', 2023, 'sedan', 480.00, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', true,
 ARRAY['GPS', 'Klimatyzacja automatyczna', 'Skórzane fotele', 'Panorama', 'Masaż foteli'], 5, 'Automatyczna', 'Benzyna'),

('Volkswagen', 'Passat Variant', 2023, 'kombi', 280.00, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', true,
 ARRAY['GPS', 'Klimatyzacja', 'Duży bagażnik', 'Bluetooth'], 5, 'Automatyczna', 'Diesel'),

('Audi', 'Q5', 2024, 'suv', 520.00, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', true,
 ARRAY['GPS', 'Klimatyzacja', 'Napęd 4x4', 'Skórzane fotele', 'Kamera 360'], 5, 'Automatyczna', 'Benzyna'),

('Toyota', 'RAV4', 2023, 'suv', 350.00, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', true,
 ARRAY['GPS', 'Klimatyzacja', 'Napęd 4x4', 'Bluetooth', 'Asystent pasa ruchu'], 5, 'Automatyczna', 'Hybryda'),

('Ford', 'Transit Custom', 2023, 'van', 320.00, 'https://images.unsplash.com/photo-1562519819-016a5fb7cc5e?w=800', true,
 ARRAY['GPS', 'Klimatyzacja', 'Duża przestrzeń ładunkowa', 'Bluetooth'], 9, 'Manualna', 'Diesel'),

('Skoda', 'Octavia Combi', 2023, 'kombi', 240.00, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', true,
 ARRAY['GPS', 'Klimatyzacja', 'Duży bagażnik', 'Bluetooth', 'Czujniki parkowania'], 5, 'Automatyczna', 'Benzyna'),

('Volvo', 'XC60', 2024, 'suv', 550.00, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800', true,
 ARRAY['GPS', 'Klimatyzacja', 'Napęd 4x4', 'Skórzane fotele', 'Systemy bezpieczeństwa'], 5, 'Automatyczna', 'Hybryda'),

('Audi', 'A6 Avant', 2024, 'kombi', 480.00, 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800', true,
 ARRAY['GPS', 'Klimatyzacja automatyczna', 'Skórzane fotele', 'Matrix LED', 'Bang & Olufsen'], 5, 'Automatyczna', 'Diesel');

INSERT INTO reservations (car_id, user_name, user_email, user_phone, start_date, end_date, total_price, status, notes) VALUES
(1, 'Jan Kowalski', 'jan.kowalski@firma.pl', '+48 123 456 789', '2026-01-20', '2026-01-25', 1250.00, 'confirmed', 'Odbiór z biura głównego'),
(3, 'Anna Nowak', 'anna.nowak@firma.pl', '+48 987 654 321', '2026-01-18', '2026-01-22', 1920.00, 'confirmed', 'Wyjazd służbowy do Warszawy'),
(5, 'Piotr Wiśniewski', 'piotr.wisniewski@firma.pl', '+48 555 123 456', '2026-01-25', '2026-01-30', 2600.00, 'pending', 'Spotkanie z klientem'),
(2, 'Maria Lewandowska', 'maria.lewandowska@firma.pl', '+48 666 789 012', '2026-01-15', '2026-01-17', 900.00, 'completed', 'Konferencja w Krakowie');

SELECT 'Cars inserted:' as info, COUNT(*) as count FROM cars;
SELECT 'Reservations inserted:' as info, COUNT(*) as count FROM reservations;
