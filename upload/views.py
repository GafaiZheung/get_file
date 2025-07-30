
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage

class FileUploadView(APIView):
    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        file_name = default_storage.save(file_obj.name, file_obj)
        return Response({'file_name': file_name}, status=status.HTTP_201_CREATED)
