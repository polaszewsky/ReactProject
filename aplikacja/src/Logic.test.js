
// To jest przykładowy test jednostkowy samej logiki (nie interfejsu)

// Funkcja którą testujemy (normalnie byłaby w innym pliku)
function calculateTotal(pricePerDay, days) {
    if (days < 0) return 0;
    return pricePerDay * days;
}

// Zestaw testów
describe('Kalkulator ceny', () => {

    // Test 1: Sprawdza czy mnożenie działa
    test('poprawnie oblicza cenę za 3 dni', () => {
        expect(calculateTotal(100, 3)).toBe(300);
    });

    // Test 2: Sprawdza czy radzi sobie z zerem
    test('zwraca 0 dla 0 dni', () => {
        expect(calculateTotal(100, 0)).toBe(0);
    });

    // Test 3: Sprawdza czy nie pozwala na ujemne dni
    test('nie pozwala na ujemne dni', () => {
        expect(calculateTotal(100, -5)).toBe(0);
    });
});
