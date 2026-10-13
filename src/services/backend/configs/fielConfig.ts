const CER_FORMAT_LIST = [
  "x-x509-ca-cert", 
  "x-x509-user-cert", 
  "pkix-cert", 
  "octet-stream"
] as const; 

const KEY_FORMAT_LIST = [
  "octet-stream", 
  "x-iwork-keynote-sffkey", 
  "pgp-keys"
] as const; 

export type CerSuportedFormats = (typeof CER_FORMAT_LIST)[number];
export const CER_MIMETYPES = [...CER_FORMAT_LIST].map((format) =>
<<<<<<< HEAD
  `application/${format}`
) as `application/${CerSuportedFormats}`[]; 
=======
  `/application/${format}`
) as `/application/${CerSuportedFormats}`[]; 
>>>>>>> 8e40804 (Feat(backend): Implemented multer middleware to verify cer and key fields in company register)


export type KeySuportedFormats = (typeof KEY_FORMAT_LIST)[number];
export const KEY_MIMETYPES = [...KEY_FORMAT_LIST].map((format) =>
<<<<<<< HEAD
  `application/${format}`
) as `application/${KeySuportedFormats}`[]; 
=======
  `/application/${format}`
) as `/application/${KeySuportedFormats}`[]; 
>>>>>>> 8e40804 (Feat(backend): Implemented multer middleware to verify cer and key fields in company register)

export const fielConfig = {
  MAX_SIZE_KB: 1024*20, 
  CER_EXTENSION: ".cer", 
  KEY_EXTENSION: ".key"
}
