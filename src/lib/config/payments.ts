// Manual payment config (temporary).
// Right now: buyer pays to the FOP IBAN by hand, then taps "I paid".
// TODO(mono): when Monobank moderation approves, replace the IBAN dialog with
// a MonoPay invoice (single exclusive method) — entry point: `IbanPayDialog`.
export const PAYMENT_METHOD: 'iban-manual' = 'iban-manual';

// Placeholder details shown in the dialog. Replace with the real FOP IBAN
// before going live — search IBAN_PLACEHOLDER.
export const IBAN_PLACEHOLDER = 'UA00 0000 0000 0000 0000 0000 0000 00';
export const IBAN_RECIPIENT_PLACEHOLDER = 'ФОП Lorem Ipsum';
export const IBAN_BANK_PLACEHOLDER = 'АТ «Lorem Bank»';
export const IBAN_PURPOSE_TEMPLATE = 'Оплата замовлення Balance Botanica';
