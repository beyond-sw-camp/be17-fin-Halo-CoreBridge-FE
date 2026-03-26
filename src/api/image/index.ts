import api from '@/plugins/axiosInterceptor'

// 백엔드 ImageDto.UploadResponseDto와 일치하는 타입
export interface ImageUploadResponse {
  id: number;
  originalName: string;
  imageName: string;
  imagePath: string;
  imageSize: number;
}

/**
 * 이미지를 서버에 업로드합니다.
 * @param file - 업로드할 이미지 파일
 * @param directory - 저장할 디렉토리 (예: 'profile')
 * @returns Promise<ImageUploadResponse>
 */
export const uploadImage = async (file: File, directory: string): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('directory', directory);

  const response = await api.post('/api/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};
