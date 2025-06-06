# apps/incubation/serializers.py

from rest_framework import serializers
from .models import Incubator, IncubationBatch

class IncubatorSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Incubator
        fields = '__all__'

class IncubationBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model  = IncubationBatch
        fields = '__all__'
