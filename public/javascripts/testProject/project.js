    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '项目名称',
                title: '项目名称',
                align: 'center'
            }, {
                field: '立项时间',
                title: '立项时间',
                align: 'center'
            }, {
                field: '项目状态',
                title: '项目状态',
                align: 'center'
            }]
        });
    });