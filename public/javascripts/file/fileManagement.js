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
                field: '发布日期',
                title: '发布日期',
                align: 'center'
            }, {
                field: '实施日期',
                title: '实施日期',
                align: 'center'
            }, {
                field: '状态',
                title: '状态',
                align: 'center'
            }]
        });
    });