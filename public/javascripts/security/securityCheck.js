    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '检查人',
                title: '检查人',
                align: 'center'
            }, {
                field: '检查日期',
                title: '检查日期',
                align: 'center'
            }, {
                field: '卫生状况',
                title: '卫生状况',
                titleTooltip:'实验室卫生状况',
                align: 'center'
            }, {
                field: '不合格情况1',
                title: '不合格情况',
                align: 'center'
            }, {
                field: '用电安全',
                title: '用电安全',
                titleTooltip:'用电安全如插座的位置等',
                align: 'center'
            }, {
                field: '不合格情况2',
                title: '不合格情况',
                align: 'center'
            }, {
                field: '仪器用品',
                title: '仪器用品',
                titleTooltip:'仪器用品的摆放情况',
                align: 'center'
            }, {
                field: '不合格情况3',
                title: '不合格情况',
                align: 'center'
            }, {
                field: '逃生路线',
                title: '逃生路线',
                titleTooltip:'应急逃生路线是否畅通',
                align: 'center'
            }, {
                field: '不合格情况4',
                title: '不合格情况',
                align: 'center'
            }, {
                field: '备注',
                title: '备注',
                align: 'center'
            }]
        });
    });