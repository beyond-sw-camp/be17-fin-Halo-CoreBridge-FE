export interface ResumeUserInfo {
  name: string;
  email: string;
  gender: string;
  phone: string;
  birth: string; // LocalDate는 ISO 8601 문자열로 넘어올 수 있습니다.
}
