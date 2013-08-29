Ext.define('Trister.view.MediaViewer', {
    extend: 'Ext.Panel',
    xtype: 'mediaviewer',

    config: {
        id: 'MediaViewerPanel',
        fullscreen: true,
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                items: [
                    {
                        id: 'CloseViewer',
                        align: 'left',
                        iconCls: 'close'
                    }
                ]
            }
        ]
    }
});