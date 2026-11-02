const filtersForm = document.querySelector('.filters-form');

if (filtersForm) {
  const productCards = document.querySelectorAll(
    '.catalog-layout__products .product-card'
  );

  const priceFromInput = filtersForm.elements.namedItem('price-from');
  const priceToInput = filtersForm.elements.namedItem('price-to');

  const emptyMessage = document.querySelector('.catalog-layout__empty');

  function applyFilters() {
    const selectedCategories = Array.from(
      filtersForm.querySelectorAll('input[name="category"]:checked')
    ).map((checkbox) => checkbox.value);

    const minPrice = priceFromInput.value === ''
      ? 0
      : priceFromInput.valueAsNumber;

    const maxPrice = priceToInput.value === ''
      ? Infinity
      : priceToInput.valueAsNumber;

    // Сбрасываем возможную ошибку предыдущей проверки.
    priceToInput.setCustomValidity('');

    if (minPrice > maxPrice) {
      priceToInput.setCustomValidity(
        'Цена «До» должна быть не меньше цены «От».'
      );
    }

    if (!filtersForm.reportValidity()) {
      return;
    }

    let visibleCount = 0;

    productCards.forEach((card) => {
      const category = card.dataset.category;
      const price = Number(card.dataset.price);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(category);

      const matchesPrice =
        price >= minPrice && price <= maxPrice;

      const isVisible = matchesCategory && matchesPrice;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  filtersForm.addEventListener('submit', (event) => {
    // Обрабатываем фильтры без перезагрузки страницы.
    event.preventDefault();
    applyFilters();
  });

  // Убираем свою ошибку, когда пользователь исправляет цену.
  [priceFromInput, priceToInput].forEach((input) => {
    input.addEventListener('input', () => {
      priceToInput.setCustomValidity('');
    });
  });

  filtersForm.addEventListener('reset', () => {
    priceToInput.setCustomValidity('');

    productCards.forEach((card) => {
      card.hidden = false;
    });

    if (emptyMessage) {
      emptyMessage.hidden = true;
    }
  });

  // Учитываем значения, которые браузер мог восстановить в форме.
  applyFilters();
}
