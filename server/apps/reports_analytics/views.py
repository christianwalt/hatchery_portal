# apps/reports_analytics/views.py

from rest_framework.views import APIView                                  
from rest_framework.response import Response                             
from rest_framework.permissions import IsAuthenticated                    
from django.db.models import Count, Sum                                          
from apps.incubation.models import IncubationBatch                       
from apps.hatching.models import HatchingRecord
from apps.sales.models import SaleRecord                           

class HatchRateReportView(APIView):
    permission_classes = [IsAuthenticated]  # only logged-in users

    def get(self, request):
        # Total eggs set across all batches
        total_set = IncubationBatch.objects.aggregate(
            total=Sum('quantity')
        )['total'] or 0                                                  

        # Total eggs hatched
        total_hatched = HatchingRecord.objects.aggregate(
            total=Sum('hatched_eggs')
        )['total'] or 0                                               

        hatch_rate = (total_hatched / total_set * 100) if total_set else 0
        return Response({'hatch_rate_percent': round(hatch_rate, 2)})

class SalesSummaryReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Group by date, sum total_amount & quantity
        data = SaleRecord.objects.values('date').annotate(
            total_amount=Sum('total_amount'),
            total_qty=Sum('quantity')
        ).order_by('date')                                            
        return Response(data)

class ProductionSummaryReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Group by breed: count batches & sum eggs set
        data = IncubationBatch.objects.values('breed').annotate(
            batch_count=Count('id'),
            total_eggs=Sum('quantity')
        ).order_by('breed')
        return Response(data)