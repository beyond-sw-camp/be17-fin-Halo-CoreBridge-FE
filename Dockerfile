FROM nginx:alpine

# dist 폴더 복사
COPY dist /usr/share/nginx/html

# SPA 대응 nginx.conf 복사
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]