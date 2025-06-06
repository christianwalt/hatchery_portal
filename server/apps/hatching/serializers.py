# apps/hatching/serializers.py

from rest_framework import serializers
from .models import HatchingRecord

class HatchingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model  = HatchingRecord
        fields = '__all__'
