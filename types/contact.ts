export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}
