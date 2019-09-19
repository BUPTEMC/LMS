    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '活动编号',
                title: '活动编号',
                align: 'center'
            }, {
                field: '活动名称',
                title: '活动名称',
                align: 'center'
            }, {
                field: '日期',
                title: '日期',
                align: 'center'
            }, {
                field: '活动类型',
                title: '活动类型',
                align: 'center'
            }]
        });
    });