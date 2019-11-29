    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '来访日期',
                title: '来访日期',
                align: 'center'
            }, {
                field: '姓名',
                title: '姓名',
                align: 'center'
            }, {
                field: '所在单位',
                title: '所在单位',
                align: 'center'
            }, {
                field: '联系方式',
                title: '联系方式',
                align: 'center'
            }, {
                field: '来访目的',
                title: '来访目的',
                align: 'center'
            }]
        });
    });