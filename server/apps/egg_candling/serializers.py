# apps/egg_candling/serializers.py

from rest_framework import serializers
from .models import FertileEggCandling, ClearEggCandling

class FertileEggCandlingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = FertileEggCandling
        fields = '__all__'

class ClearEggCandlingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ClearEggCandling
        fields = '__all__'
