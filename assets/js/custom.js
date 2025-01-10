document.addEventListener('DOMContentLoaded', function () {
    const products = [
        {
            id: 1,
            name: 'طقم كامل',
            description: 'متوفر بمقاسات M/L/XL',
            price: 29000,
            image: 'assets/img/1.png',
            colors: ['One Color'],
            rating: 4,
            images: [
                'assets/img/product_single_01.jpg',
                'assets/img/product_single_02.jpg',
                'assets/img/product_single_03.jpg'
            ],
            additionalDetails: [
                'خامة قطنية ممتازة',
                'مريح للارتداء طوال اليوم',
                'مناسب للأنشطة الرياضية'
            ]
        },
        {
            id: 2,
            name: 'شنطة ',
            description: 'متوفر بمقاسات M/L/XL',
            price: 1500,
            image: 'assets/img/1.png',
            colors: ['One Color'],
            rating: 4,
            images: [
                'assets/img/product_single_01.jpg',
                'assets/img/product_single_02.jpg',
                'assets/img/product_single_03.jpg'
            ],
            additionalDetails: [
                'خامة قطنية ممتازة',
                'مريح للارتداء طوال اليوم',
                'مناسب للأنشطة الرياضية'
            ]
        }

    ];

    const cart = [];
    const productContainer = document.querySelector('.product-list');

    // إنشاء بطاقات المنتجات
    products.forEach(product => {
        const colorDots = product.colors.map(color => `<span class="product-color-dot color-dot-${color} float-left rounded-circle ml-1"></span>`).join('');
        const stars = Array.from({ length: 5 })
            .map((_, i) => `<i class="${i < product.rating ? 'text-warning' : 'text-muted'} fa fa-star"></i>`)
            .join('');

        const productCard = `
            <div class="col-md-4">
                <div class="card mb-4 product-wap rounded-0" data-id="${product.id}">
                    <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="${product.image}" alt="${product.name}">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                                <li><a class="btn btn-success text-white mt-2" href="shop-single.html?product_id=${product.id}"><i class="far fa-eye"></i> </a></li>
                                <li><a class="btn btn-success text-white mt-2 add-to-cart" href="#" data-id="${product.id}"><i class="fas fa-cart-plus"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <a href="shop-single.html?product_id=${product.id}" class="h3 text-decoration-none">${product.name}</a>
                        <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                            <li>${product.description}</li>
                            <li class="pt-2">${colorDots}</li>
                        </ul>
                        <ul class="list-unstyled d-flex justify-content-center mb-1">
                            <li>${stars}</li>
                        </ul>
                        <p class="text-center mb-0">${product.price} ريال</p>
                    </div>
                </div>
            </div>`;
        productContainer.innerHTML += productCard;
    });

    // التعامل مع إضافة المنتجات إلى السلة
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(button.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            const existingProduct = cart.find(p => p.id === productId);

            if (existingProduct) {
                existingProduct.quantity++;
                alert("تم تحديث الكمية في السلة!");
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            updateCart();
        });
    });

    // تحديث السلة وعرضها في النافذة المنبثقة
    function updateCart() {
        const cartItems = cart.map(item => {
            return `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price} ريال</td>
                <td>${item.price * item.quantity} ريال</td>
                <td><button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">حذف</button></td>
            </tr>`;
        }).join('');

        document.getElementById('cartTable').getElementsByTagName('tbody')[0].innerHTML = cartItems;

        // تحديث إجمالي المبلغ
        const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        document.getElementById('totalAmount').textContent = `الإجمالي: ${totalAmount} ريال`;

        // تحديث عدد السلة في رأس الصفحة
        document.getElementById('cartBadge').textContent = cart.length;

        // إضافة حدث حذف لكل زر "حذف"
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const productId = parseInt(button.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }

    // دالة لحذف المنتج من السلة
    function removeFromCart(productId) {
        const productIndex = cart.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            cart.splice(productIndex, 1); // إزالة المنتج من السلة
        }

        updateCart(); // تحديث السلة بعد الحذف
    }

    // فتح نافذة السلة
    document.getElementById('cartIcon').addEventListener('click', function () {
        document.getElementById('cartModal').style.display = 'block';
    });

    // إغلاق نافذة السلة
    document.getElementById('closeCartModal').addEventListener('click', function () {
        document.getElementById('cartModal').style.display = 'none';
    });

    // إتمام الشراء
    document.getElementById('checkoutBtn').addEventListener('click', function () {
        if (cart.length === 0) {
            alert("السلة فارغة. يرجى إضافة منتجات للشراء.");
            return;
        }

        // حساب تفاصيل السلة
        let cartDetails = cart.map(item => `- ${item.name} (العدد: ${item.quantity}): ${item.price * item.quantity} ريال`).join('\n');
        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0); // العدد الإجمالي
        let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // السعر الإجمالي
        
        // صياغة الرسالة
        let message = `تفاصيل السلة:\n${cartDetails}\n\nعدد المنتجات: ${totalQuantity}\nالإجمالي: ${totalPrice} ريال`;
      
        // رابط WhatsApp
        let phoneNumber = "+967779470000"; // ضع هنا رقم الهاتف
        let whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // فتح الرابط
        window.open(whatsappLink, '_blank');
    });
});
