import { render, screen } from '@testing-library/react';
import React from 'react';

// Prosty komponent tylko na potrzeby testu (w prawdziwym projekcie importowalibyśmy go)
function Badge({ status }) {
    if (status === 'active') return <span>Aktywny</span>;
    return <span>Nieaktywny</span>;
}

// Test sprawdzający czy komponent dobrze wyświetla się dla różnych stanów
test('Badge wyświetla "Aktywny" gdy status to active', () => {
    render(<Badge status="active" />);
    const element = screen.getByText(/Aktywny/i);
    expect(element).toBeInTheDocument();
});

test('Badge wyświetla "Nieaktywny" dla innego statusu', () => {
    render(<Badge status="inactive" />);
    const element = screen.getByText(/Nieaktywny/i);
    expect(element).toBeInTheDocument();
});
