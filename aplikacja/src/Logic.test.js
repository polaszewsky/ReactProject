function calculateTotal(pricePerDay, days) {
    if (days < 0) return 0;
    return pricePerDay * days;
}

describe('Kalkulator ceny', () => {

    test('poprawnie oblicza cenę za 3 dni', () => {
        expect(calculateTotal(100, 3)).toBe(300);
    });

    test('zwraca 0 dla 0 dni', () => {
        expect(calculateTotal(100, 0)).toBe(0);
    });

    test('nie pozwala na ujemne dni', () => {
        expect(calculateTotal(100, -5)).toBe(0);
    });
});
