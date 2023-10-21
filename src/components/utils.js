export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function getAllowedRoles() {
  return ["ROLE_ADMIN", "ROLE_USER", "ROLE_MODERATOR", "ROLE_FAKTURISTA", "ROLE_MAGACIONER"];
}

export function formatNumber (number) {
  return <span>{Number(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} RSD</span>
}

export function formatNumberKG (number) {
  return <span>{Number(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} KG</span>
}

export function discountedPrice (price, discount) {
  return (Number(price) * (1 - Number(discount / 100)).toFixed(2));
}

export function priceWithPDV (price, discount) {
  return (Number(price) * (1 + Number(discount / 100)).toFixed(2));
}

    
export function formatNumberWithoutPostfix (number) {
  return <span>{Number(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span>
}
