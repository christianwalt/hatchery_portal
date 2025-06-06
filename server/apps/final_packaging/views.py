from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models       import PackagingBatch
from .serializers  import PackagingBatchSerializer

class PackagingBatchViewSet(viewsets.ModelViewSet):
    """
    List, create, retrieve, update, and destroy PackagingBatch entries.
    """
    queryset           = PackagingBatch.objects.all()
    serializer_class   = PackagingBatchSerializer
    permission_classes = [IsAuthenticated]
