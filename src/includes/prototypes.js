Number.prototype.formatBytes = function(decimals = 2) {

	if (this === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(this) / Math.log(k));

    return parseFloat((this / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}