    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '项目名称',
                title: '项目名称',
                align: 'center'
            }, {
                field: '样品编号',
                title: '样品编号',
                align: 'center'
            }, {
                field: '样品名称',
                title: '样品名称',
                align: 'center'
            }, {
                field: '日期',
                title: '日期',
                align: 'center'
            }, {
                field: '详情',
                title: '详情',
                align: 'center'
            }]
        });
    });