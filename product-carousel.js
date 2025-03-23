(() => {
    const PRODUCTS_API_URL = 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json';
    const LOCAL_STORAGE_KEY = 'ebebek_products';
    const FAVORITES_STORAGE_KEY = 'ebebek_favorites';
    
    let products = [];
    let favorites = [];

    const isHomePage = () => {
        return window.location.hostname.includes('e-bebek.com') && window.location.pathname === '/';
      };
    
    const init = () => {

        if (!isHomePage()) {
            console.log('wrong page');
            return;
        }

        loadFavorites();
        
        const cachedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
        
        if (cachedProducts) {
            try {
                products = JSON.parse(cachedProducts);
                buildCarousel();
            } catch (error) {
                console.error('Error parsing cached products:', error);
                fetchProducts();
            }
        } else {
            fetchProducts();
        }
    };
    
    const loadFavorites = () => {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            if (storedFavorites) {
                favorites = JSON.parse(storedFavorites);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            favorites = [];
        }
    };
    
    const saveFavorites = () => {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };
    
    const fetchProducts = async () => {
        try {
            console.log('Fetching products from:', PRODUCTS_API_URL);
            const response = await fetch(PRODUCTS_API_URL);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Fetched data is not an array');
            }
            
            products = data;
            
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
            } catch (error) {
                console.error('Error caching products:', error);
            }
            
            buildCarousel();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    
    
    const buildCarousel = () => {
        buildHtml();
        buildCSS();
        setEvents();
    };
    
    const buildHtml = () => {
        const mainContainer = document.createElement('div');
        mainContainer.className = 'ebebek-main-container';
        
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'ebebek-carousel-container';
        
        const titleContainer = document.createElement('div');
        titleContainer.className = 'ebebek-carousel-title-container';
        
        const title = document.createElement('h2');
        title.className = 'ebebek-carousel-title';
        title.textContent = 'Beğenebileceğinizi düşündüklerimiz';
        titleContainer.appendChild(title);
        
        carouselContainer.appendChild(titleContainer);
        
        const carouselWrapper = document.createElement('div');
        carouselWrapper.className = 'ebebek-carousel-wrapper';
        
        const productSlider = document.createElement('div');
        productSlider.className = 'ebebek-carousel-slider';
        
        if (products && products.length > 0) {
            products.forEach(product => {
                if (product) {
                    productSlider.appendChild(createProductCard(product));
                }
            });
        } else {
            const noProducts = document.createElement('p');
            noProducts.textContent = 'Ürün bulunamadı.';
            noProducts.style.textAlign = 'center';
            noProducts.style.padding = '20px';
            noProducts.style.width = '100%';
            productSlider.appendChild(noProducts);
        }
        
        carouselWrapper.appendChild(productSlider);
        
        carouselContainer.appendChild(carouselWrapper);
        
        mainContainer.appendChild(carouselContainer);
        
        const prevButton = document.createElement('button');
        prevButton.className = 'ebebek-carousel-prev';
        prevButton.innerHTML = '<img src="https://cdn06.e-bebek.com/assets/svg/prev.svg" alt="Önceki">';
        mainContainer.appendChild(prevButton);
        
        const nextButton = document.createElement('button');
        nextButton.className = 'ebebek-carousel-next';
        nextButton.innerHTML = '<img src="https://cdn06.e-bebek.com/assets/svg/next.svg" alt="Sonraki">';
        mainContainer.appendChild(nextButton);
        
        const section2A = document.querySelector('.Section2A');
        if (section2A) {
            section2A.insertBefore(mainContainer, section2A.firstChild);
        } else {
            const main = document.querySelector('main');
            if (main) {
                main.appendChild(mainContainer);
            } else {
                document.body.appendChild(mainContainer);
            }
        }
    };
    
    const createProductCard = (product) => {
        if (!product || !product.id) {
            console.error('Invalid product data:', product);
            return document.createElement('div');
        }
        
        const card = document.createElement('div');
        card.className = 'ebebek-product-card';
        card.dataset.productId = product.id;
        
        const productLink = document.createElement('a');
        productLink.href = product.url || '#';
        productLink.target = '_blank';
        productLink.className = 'ebebek-product-link';
        
        const cokSatanBadge = document.createElement('div');
        cokSatanBadge.className = 'ebebek-cok-satan-badge';
        cokSatanBadge.innerHTML = '<span>ÇOK</span><span>SATAN</span>';
        card.appendChild(cokSatanBadge);
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'ebebek-product-image-container';
        
        const image = document.createElement('img');
        image.src = product.img || product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="20" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EResim Yok%3C/text%3E%3C/svg%3E';
        image.alt = product.name || 'Ürün';
        image.className = 'ebebek-product-image';
        image.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="20" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EResim Yok%3C/text%3E%3C/svg%3E';
        };
        imageContainer.appendChild(image);
        
        const favoriteIcon = document.createElement('button');
        favoriteIcon.className = 'ebebek-favorite-icon';
        
        const defaultHeartSvg = `
            <svg class="default-heart" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                    fill="${favorites.includes(product.id) ? 'var(--ebebek-primary)' : 'none'}" 
                    stroke="var(--ebebek-primary)" stroke-width="1.5"/>
            </svg>`;
            
        const hoverHeartSvg = `
            <svg class="hover-heart" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--ebebek-primary)" style="display:none;">
                <path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm280-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z"/>
            </svg>`;
        
        favoriteIcon.innerHTML = defaultHeartSvg + hoverHeartSvg;
        favoriteIcon.dataset.productId = product.id;
        
        favoriteIcon.addEventListener('mouseenter', () => {
            if (!favorites.includes(product.id)) {
                const defaultHeart = favoriteIcon.querySelector('.default-heart');
                const hoverHeart = favoriteIcon.querySelector('.hover-heart');
                if (defaultHeart && hoverHeart) {
                    defaultHeart.style.display = 'none';
                    hoverHeart.style.display = 'block';
                }
            }
        });
        
        favoriteIcon.addEventListener('mouseleave', () => {
            if (!favorites.includes(product.id)) {
                const defaultHeart = favoriteIcon.querySelector('.default-heart');
                const hoverHeart = favoriteIcon.querySelector('.hover-heart');
                if (defaultHeart && hoverHeart) {
                    defaultHeart.style.display = 'block';
                    hoverHeart.style.display = 'none';
                }
            }
        });
        
        favoriteIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
        });
        
        imageContainer.appendChild(favoriteIcon);
        productLink.appendChild(imageContainer);
        
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'ebebek-product-details';
        
        const nameContainer = document.createElement('div');
        nameContainer.className = 'ebebek-product-name';
        
        if (product.brand) {
            const brandSpan = document.createElement('span');
            brandSpan.className = 'ebebek-product-brand';
            brandSpan.textContent = product.brand;
            brandSpan.style.fontWeight = 'bold';
            nameContainer.appendChild(brandSpan);
            
            const hyphen = document.createTextNode(' - ');
            nameContainer.appendChild(hyphen);
        }
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = product.name || 'Ürün Adı';
        nameContainer.appendChild(nameSpan);
        
        detailsContainer.appendChild(nameContainer);
        
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'ebebek-product-rating';
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.className = 'ebebek-star';
            star.innerHTML = '★';
            ratingContainer.appendChild(star);
        }
        
        const reviewCount = document.createElement('span');
        reviewCount.className = 'ebebek-review-count';
        const randomReviews = Math.floor(Math.random() * 50) + 1;
        reviewCount.textContent = `(${randomReviews})`;
        ratingContainer.appendChild(reviewCount);
        
        detailsContainer.appendChild(ratingContainer);
        
        const priceContainer = document.createElement('div');
        priceContainer.className = 'ebebek-product-price-container';
        
        const price = parseFloat(product.price) || 0;
        const originalPrice = parseFloat(product.original_price) || 0;
        
        const discountContainer = document.createElement('div');
        discountContainer.className = 'ebebek-discount-container';
        
        if (originalPrice > price) {
            const originalPriceElement = document.createElement('span');
            originalPriceElement.className = 'ebebek-product-original-price';
            originalPriceElement.textContent = `${originalPrice.toFixed(2).replace('.', ',')} TL`;
            
            const discountPercentage = Math.round((1 - (price / originalPrice)) * 100);
            
            const discountBadge = document.createElement('span');
            discountBadge.className = 'ebebek-product-discount-badge';
            discountBadge.innerHTML = `%${discountPercentage} 
                <div class="arrow-circle">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="var(--ebebek-white)">
                    <path d="M480-240 240-480l56-56 144 144v-368h80v368l144-144 56 56-240 240Z" />
                </svg>
                </div>
            `;
            
            discountContainer.appendChild(originalPriceElement);
            discountContainer.appendChild(discountBadge);
            
            const priceElement = document.createElement('span');
            priceElement.className = 'ebebek-product-price ebebek-product-price-discounted';
            priceElement.textContent = `${price.toFixed(2).replace('.', ',')} TL`;
            
            priceContainer.appendChild(discountContainer);
            priceContainer.appendChild(priceElement);
        } else {
            discountContainer.style.visibility = "hidden";
            discountContainer.style.height = "22px";
            
            const priceElement = document.createElement('span');
            priceElement.className = 'ebebek-product-price';
            priceElement.textContent = `${price.toFixed(2).replace('.', ',')} TL`;
            
            priceContainer.appendChild(discountContainer);
            priceContainer.appendChild(priceElement);
        }
        
        detailsContainer.appendChild(priceContainer);
        
        const addToCartButton = document.createElement('button');
        addToCartButton.className = 'ebebek-add-to-cart-button';
        addToCartButton.textContent = 'Sepete Ekle';
        
        detailsContainer.appendChild(addToCartButton);
        productLink.appendChild(detailsContainer);
        
        card.appendChild(productLink);
        return card;
    };
    
    const toggleFavorite = (productId) => {
        if (!productId) return;
        
        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
        } else {
            favorites.push(productId);
        }
        
        document.querySelectorAll(`.ebebek-favorite-icon[data-product-id="${productId}"]`).forEach(icon => {
            const defaultHeart = icon.querySelector('.default-heart path');
            if (defaultHeart) {
                defaultHeart.setAttribute('fill', favorites.includes(productId) ? 'var(--ebebek-primary)' : 'none');
            }
            
            if (favorites.includes(productId)) {
                const defaultHeartSvg = icon.querySelector('.default-heart');
                const hoverHeartSvg = icon.querySelector('.hover-heart');
                if (defaultHeartSvg && hoverHeartSvg) {
                    defaultHeartSvg.style.display = 'block';
                    hoverHeartSvg.style.display = 'none';
                }
            }
        });
        
        saveFavorites();
    };
    
    const buildCSS = () => {
        const css = `
            :root {
                --ebebek-primary: #f28e00;
                --ebebek-primary-light: #fef6eb;
                --ebebek-primary-lighter: #fff7ec;
                --ebebek-success: #00a365;
                --ebebek-text-gray: #7d7d7d;
                --ebebek-white: #fff;
                --ebebek-star-color: #fed100;
                --ebebek-border-light: #eee;
                --ebebek-text-dark: rgb(33, 39, 56);
                --ebebek-border-radius-large: 35px;
                --ebebek-border-radius-medium: 8px;
                --ebebek-border-radius-circle: 50%;
                --ebebek-font-primary: Poppins, "cursive";
                --ebebek-font-secondary: Quicksand-Bold, 'Quicksand', sans-serif;
                --ebebek-shadow: 15px 15px 30px 0 #ebebeb80;
                --ebebek-shadow-small: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
                --ebebek-transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }
            
            .ebebek-main-container {
                max-width: 1300px;
                font-family: var(--ebebek-font-primary);
                position: relative;
            }
            
            .ebebek-carousel-container {
                display: flex;
                flex-direction: column;
            }
            
            .ebebek-carousel-title-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: var(--ebebek-primary-light);
                padding: 25px 67px;
                border-top-left-radius: var(--ebebek-border-radius-large);
                border-top-right-radius: var(--ebebek-border-radius-large);
                font-family: var(--ebebek-font-secondary);
                font-weight: 700;
            }
            
            .ebebek-carousel-title {
                font-family: var(--ebebek-font-secondary);
                font-size: 3rem;
                font-weight: 700;
                line-height: 1.11;
                color: var(--ebebek-primary);
                margin: 0;
            }
            
            .ebebek-carousel-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                box-shadow: var(--ebebek-shadow);
                border-radius: 0 0 var(--ebebek-border-radius-large) var(--ebebek-border-radius-large);
                background-color: var(--ebebek-white);
            }
            
            .ebebek-carousel-slider {
                display: flex;
                overflow-x: hidden;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                -ms-overflow-style: none;
                width: 100%;
                padding: 10px 3px;
            }
            
            .ebebek-carousel-slider::-webkit-scrollbar {
                display: none;
            }
            
            .ebebek-carousel-prev,
            .ebebek-carousel-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                background-color: var(--ebebek-primary-light);
                border: none;
                border-radius: var(--ebebek-border-radius-circle);
                cursor: pointer;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .ebebek-carousel-prev {
                left: -65px;
            }
            
            .ebebek-carousel-next {
                right: -65px;
            }
            
            .ebebek-carousel-prev:hover,
            .ebebek-carousel-next:hover {
                background-color: var(--ebebek-white);
                border: 1px solid var(--ebebek-primary);
            }
            
            .ebebek-carousel-prev img,
            .ebebek-carousel-next img {
                width: 20px;
                height: 20px;
            }
            
            .ebebek-product-card {
                flex: 0 0 calc((100% - 100px) / 5);
                width: 242px;
                height: 557px;
                margin: 0 20px 20px 0;
                padding: 5px;
                position: relative;
                border-radius: var(--ebebek-border-radius-medium);
                overflow: hidden;
                background-color: var(--ebebek-white);
                border: 1px solid var(--ebebek-border-light);
                float: left;
                color: var(--ebebek-text-dark);
                font-family: var(--ebebek-font-primary);
                font-size: 9.6px;
                font-weight: 400;
                line-height: 15.36px;
                text-align: start;
                box-sizing: border-box;
                user-select: none;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                display: flex;
                flex-direction: column;
            }
            
            .ebebek-product-card:hover {
                border-color: var(--ebebek-primary);
                box-shadow: 0 0 0 3px var(--ebebek-primary);
                z-index: 1;
            }
            
            .ebebek-product-link {
                text-decoration: none;
                color: inherit;
                display: flex;
                flex-direction: column;
                height: 100%;
                justify-content: space-between;
            }
            
            .ebebek-product-image-container {
                position: relative;
                padding-top: 100%;
                margin-bottom: 10px;
            }
            
            .ebebek-product-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .ebebek-favorite-icon {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: var(--ebebek-white);
                border: none;
                border-radius: var(--ebebek-border-radius-circle);
                cursor: pointer;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                padding: 0;
                box-shadow: var(--ebebek-shadow-small);
                transition: transform 0.2s ease;
            }
            
            .ebebek-product-details {
                display: flex;
                flex-direction: column;
                gap: 5px;
                height: 100%;
                position: relative;
                justify-content: space-between;
                padding: 0 17px 17px;
            }
            
            .ebebek-product-brand,
            .ebebek-product-name {
                font-size: 1.2rem;
                height: 42px;
                overflow: hidden;
                margin-bottom: 2px;
                color: var(--ebebek-text-gray);
            }
            
            .ebebek-product-rating {
                display: flex;
                align-items: center;
                padding: 5px 0 0;
            }
            
            .ebebek-star {
                color: var(--ebebek-star-color);
                font-size: 22px;
                margin-right: 2px;
            }
            
            .ebebek-review-count {
                color: var(--ebebek-text-gray);
                font-size: 12px;
                margin-left: 4px;
            }
            
            .ebebek-product-price-container {
                display: flex;
                flex-direction: column;
                margin-bottom: 10px;
            }
            
            .ebebek-discount-container {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
            }
            
            .ebebek-product-price {
                display: block;
                width: 100%;
                font-size: 2.2rem;
                font-weight: 600;
                color: var(--ebebek-text-gray);
                margin-top: 10px;
            }
            
            .ebebek-product-price-discounted {
                color: var(--ebebek-success);
            }

            .arrow-circle {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                border-radius: var(--ebebek-border-radius-circle);
                background-color: var(--ebebek-success);
                cursor: pointer;
            }

            .arrow-circle svg {
                width: 16px;
                height: 16px;
            }

            .ebebek-product-original-price {
                font-size: 14px;
                text-decoration: line-through;
                color: var(--ebebek-text-gray);
            }
            
            .ebebek-product-discount-badge {
                color: var(--ebebek-success);
                font-size: 18px;
                font-weight: 700;
                padding: 2px 6px;
                border-radius: 4px;
            }
            
            .ebebek-add-to-cart-button {
                width: 100%;
                padding: 15px 20px;
                border-radius: 37.5px;
                background-color: var(--ebebek-primary-lighter);
                color: var(--ebebek-primary);
                font-family: var(--ebebek-font-primary);
                font-size: 1.4rem;
                font-weight: 700;
                border: 1px solid rgba(0, 0, 0, 0);
                position: relative;
                z-index: 2;
                margin-top: auto;
                cursor: pointer;
                transition: var(--ebebek-transition);
            }
            
            .ebebek-add-to-cart-button:hover {
                background-color: var(--ebebek-primary);
                color: var(--ebebek-white);
            }
            
            .ebebek-cok-satan-badge {
                position: absolute;
                top: 10px;
                left: 10px;
                background-color: var(--ebebek-primary);
                border-radius: var(--ebebek-border-radius-circle);
                width: 48px;
                height: 48px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: var(--ebebek-white);
                font-weight: bold;
                font-size: 10px;
                line-height: 1;
                padding: 5px;
                z-index: 1;
                font-family: var(--ebebek-font-primary);
            }
            
            @media (max-width: 1480px) {
                .ebebek-product-card {
                    flex: 0 0 calc((100% - 80px) / 4);
                }
                .ebebek-main-container {
                    max-width: 1100px;
                }
            }

            @media (max-width: 1280px) {
                .ebebek-product-card {
                    flex: 0 0 calc((100% - 60px) / 3);
                }
                .ebebek-main-container {
                    max-width: 1000px;
                }
            }

            @media (max-width: 992px) {
                .ebebek-product-card {
                    flex: 0 0 calc((100% - 40px) / 2);
                }
                .ebebek-main-container {
                    max-width: 600px;
                }
            }
            
            @media (max-width: 576px) {
                .ebebek-main-container {
                    max-width: 500px;
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    };
    
    const setEvents = () => {
        const prevButton = document.querySelector('.ebebek-carousel-prev');
        const nextButton = document.querySelector('.ebebek-carousel-next');
        const slider = document.querySelector('.ebebek-carousel-slider');
        
        if (prevButton && nextButton && slider) {
            const cardWidth = slider.querySelector('.ebebek-product-card')?.offsetWidth || 200;
            const scrollAmount = cardWidth; 
            
            prevButton.addEventListener('click', () => {
                slider.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });
            
            nextButton.addEventListener('click', () => {
                slider.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
        }
    };

    init();
})(); 