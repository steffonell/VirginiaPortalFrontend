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


const articlePriceWithDiscount = (article) => {
  return (Number(article.retailPrice) * (1 - Number(brandDiscount(article.brand)) / 100)).toFixed(2);
}

const discountedPrice = (price, discount) => {
  return (Number(price) * (1 - Number(discount / 100)).toFixed(2));
}

const priceWithPDV = (price, discount) => {
  return (Number(price) * (1 + Number(discount / 100)).toFixed(2));
}
