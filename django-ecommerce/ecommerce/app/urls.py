from django.urls import path
from .views import *

urlpatterns = [
    path('', LoginView.as_view(), name ='login'),
    path('register/', registerView.as_view(), name='register'),
    path('index/',ProductListView.as_view(), name='index'),
    path("forgotpassword/",Forgotpassword.as_view(), name ="forgotpassword"),
    path("reset/<uuid:uuid>",Resetpassword.as_view(), name ="resetpassword"),
    path("logout/",logoutView.as_view(), name="logout"),

    path("add_category/", AddCategoryView.as_view(), name="add_category"),
    path("add_subcategory/", AddSubcategoryView.as_view(), name="add_subcategory"),
    path("add_product/", AddProductView.as_view(), name="add_product"),
    path('delete-product/<int:product_id>/', DeleteProductView.as_view(), name='delete_product'),
    path('update-product/<int:product_id>/', UpdateProductView.as_view(), name='update_product'),

    path("user_dashboard/", UserDashboard.as_view(), name="user_dashboard"),
    path('add-to-cart/', add_to_cart, name='add_to_cart'),

]