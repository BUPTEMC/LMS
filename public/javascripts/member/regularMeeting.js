    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '日期',
                title: '日期',
                align: 'center'
            }, {
                field: '主持人',
                title: '主持人',
                align: 'center'
            }, {
                field: '主要内容',
                title: '主要内容',
                align: 'center'
            }, {
                field: '记录员',
                title: '记录员',
                align: 'center'
            }]
        });
    });