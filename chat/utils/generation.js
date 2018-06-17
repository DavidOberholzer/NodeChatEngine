export const randomId = () => {
    return Array.apply(null, new Array(22))
        .map(() => {
            return (charset => {
                return charset.charAt(
                    Math.floor(Math.random() * charset.length)
                );
            })(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            );
        })
        .join('');
};

export const b64u = str => {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(
        encodeURIComponent(str).replace(
            /%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }
        )
    );
};
