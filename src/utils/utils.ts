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
