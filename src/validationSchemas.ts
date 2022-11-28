export const APPOINTMENT_SCHEMA = ['date', 'patient', 'personel'];

export const PATIENT_SCHEMA = ['name', 'surname', 'dateOfBirth', 'peselNumber', 'phoneNumber', 'email'];

export const PERSONEL_SCHEMA_CREATE = [
    'name',
    'surname',
    'occupation',
    'phoneNumber',
    'email',
    'licenseNumber',
    'unit',
  ];

  export const PERSONEL_SCHEMA_UPDATE = ['surname', 'email', 'phoneNumber'];

  export const UNITS_SCHEMA = ['name', 'floor'];