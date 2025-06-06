"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter # Auto-generates routes

from apps.egg_collections.views import EggCollectionViewSet
from apps.egg_settings.views import EggSettingViewSet
from apps.incubation.views import (
    IncubatorViewSet,
    IncubationBatchViewSet
)
from apps.egg_candling.views import (
    FertileEggCandlingViewSet,
    ClearEggCandlingViewSet
)
from apps.lockdown.views import LockdownBatchViewSet
from apps.hatching.views import HatchingRecordViewSet
from apps.final_packaging.views import PackagingBatchViewSet
from apps.sales.views import SaleRecordViewSet
from apps.alerts.views import AlertViewSet
from apps.reports_analytics.views import (
    HatchRateReportView,
    SalesSummaryReportView,
    ProductionSummaryReportView
)
from apps.notifications.views import NotificationViewSet

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'egg-collections', EggCollectionViewSet, basename='egg-collection')
router.register(r'egg-settings', EggSettingViewSet, basename='egg-setting')
router.register(r'incubators', IncubatorViewSet, basename='incubator')
router.register(r'incubations', IncubationBatchViewSet, basename='incubation')
router.register(r'egg-candling/fertile', FertileEggCandlingViewSet, basename='fertile-candling')
router.register(r'egg-candling/clear',   ClearEggCandlingViewSet,   basename='clear-candling')
router.register(r'lockdown-batches', LockdownBatchViewSet, basename='lockdown-batch')
router.register(r'hatchings', HatchingRecordViewSet, basename='hatching')
router.register(r'packaging-batches', PackagingBatchViewSet, basename='packaging-batch')
router.register(r'sales', SaleRecordViewSet, basename='sale')
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'notifications', NotificationViewSet, basename='notification')


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # JWT authentication endpoints
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Report endpoints (not router-registered)
    path('api/reports/hatch-rate/',   HatchRateReportView.as_view(),    name='report-hatch-rate'),
    path('api/reports/sales/',        SalesSummaryReportView.as_view(), name='report-sales'),
    path('api/reports/production/',   ProductionSummaryReportView.as_view(), name='report-production'),
    
    # App-specific API routes
    path('api/', include(router.urls)),
]
