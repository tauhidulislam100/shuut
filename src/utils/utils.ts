export function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const turnicate = (name: string) => {
  return name.length <= 24 ? name : name.substring(0, 21) + "...";
};

export const formatMoney = (item: string, symbol = "", readable = false) => {
  return symbol + item;
};

export function formatNumber(n: string | number, d = 2) {
  let x = ("" + parseInt(n as string)).length;
  d = Math.pow(10, d);
  x -= x % 3;
  return (
    Math.round(((n as number) * d) / Math.pow(10, x)) / d + " KMGTPE"[x / 3]
  );
}
export function getPosition(
  options?: PositionOptions
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

export function checkDateOverlaps(
  a_start: Date,
  a_end: Date,
  b_start: Date,
  b_end: Date
) {
  if (
    (a_start <= b_start && b_start <= a_end) ||
    (a_start <= b_end && b_end <= a_end) ||
    (b_start < a_start && a_end < b_end)
  ) {
    // if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    // if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    // if (b_start < a_start && a_end < b_end) return true; // a in b
    return true;
  }
  return false;
}

export function roundBy(n = 1, _r = 7) {
  if (n % _r === 0) {
    return n;
  } else {
    return Math.round(Math.floor(n / _r)) * _r + _r;
  }
}
