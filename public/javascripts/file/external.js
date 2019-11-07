    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '文件编号',
                title: '文件编号',
                align: 'center'
            }, {
                field: '文件名称',
                title: '文件名称',
                align: 'center'
            }, {
                field: '份数',
                title: '份数',
                align: 'center'
            }, {
                field: '文件来源单位',
                title: '文件来源单位',
                align: 'center'
            }, {
                field: '接收人',
                title: '接收人',
                align: 'center'
            }, {
                field: '接收日期',
                title: '接收日期',
                align: 'center'
            }, {
                field: '审阅人',
                title: '审阅人',
                align: 'center'
            }, {
                field: '文件内容',
                title: '文件内容',
                align: 'center'
            }]
        });
    });