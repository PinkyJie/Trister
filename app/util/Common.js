Ext.define('Trister.util.Common', {
    singleton: true,

    process_time: function(d) {
        var diff = new Date().getTime() - new Date(d).getTime();
        if (diff > 1000 * 60 * 60 * 24) {
            return Math.floor(diff / (1000 * 60 * 60 * 24)) + " d ago";
        } else if (diff > 1000 * 60 * 60) {
            return Math.floor(diff / (1000 * 60 * 60)) + " h ago";
        } else if (diff > 1000 * 60) {
            return Math.floor(diff / (1000 * 60)) + " m ago";
        } else {
            return Math.floor(diff / 1000) + " s ago";
        }
    }
});