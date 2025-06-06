# apps/sales/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models       import SaleRecord
from .serializers  import SaleRecordSerializer

class SaleRecordViewSet(viewsets.ModelViewSet):
    queryset           = SaleRecord.objects.all()
    serializer_class   = SaleRecordSerializer
    permission_classes = [IsAuthenticated]
