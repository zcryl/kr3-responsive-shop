// Нативный dialog удерживает фокус внутри окна и закрывается по Escape.
const orderDialog = document.getElementById('order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const selectedProductText = document.getElementById('selected-product-text');
let dialogOpener;

if (orderDialog) {
  document.querySelectorAll('[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      dialogOpener = button;
      const product = button.dataset.product;
      selectedProductInput.value = product;
      selectedProductText.textContent = product ? `Товар: ${product}` : 'Общая заявка';
      document.getElementById('success-message').hidden = true;
      orderDialog.showModal();
    });
  });
  document.getElementById('close-order-dialog').addEventListener('click', () => orderDialog.close());
  orderDialog.addEventListener('close', () => dialogOpener?.focus());
  const requestedProduct = new URLSearchParams(window.location.search).get('product');
  if (requestedProduct) {
    const requestButton = document.getElementById('open-request');
    requestButton.dataset.product = requestedProduct;
    document.getElementById('request-product').textContent = `Выбран товар: ${requestedProduct}`;
  }
}

// Общая проверка формы заявки и обратной связи. Backend не подключён.
document.querySelectorAll('.order-form').forEach((form) => {
  const controls = Array.from(form.elements).filter((field) =>
    field.matches('input, select, textarea') && field.willValidate
  );
  const status = document.getElementById(form.dataset.success);
  function clearError(field) {
    field.removeAttribute('aria-invalid');
    document.getElementById(`${field.id}-error`).textContent = '';
  }
  controls.forEach((field) => {
    const error = document.createElement('p');
    error.id = `${field.id}-error`;
    error.className = 'form-error';
    error.setAttribute('aria-live', 'polite');
    field.closest('.order-form__field').append(error);
    const hint = field.getAttribute('aria-describedby');
    field.setAttribute('aria-describedby', [hint, error.id].filter(Boolean).join(' '));
    field.addEventListener('input', () => {
      clearError(field);
      status.hidden = true;
    });
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.hidden = true;
    let firstInvalid;
    controls.forEach((field) => {
      clearError(field);
      if (!field.checkValidity()) {
        field.setAttribute('aria-invalid', 'true');
        document.getElementById(`${field.id}-error`).textContent = field.validationMessage;
        firstInvalid ??= field;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    form.reset();
    if (form.id === 'order-form') orderDialog.close();
    status.hidden = false;
  });
});
