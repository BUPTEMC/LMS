    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '分包方名称',
                title: '分包方名称',
                align: 'center'
            }, {
                field: '地址',
                title: '地址',
                align: 'center'
            }, {
                field: '联系人',
                title: '联系人',
                align: 'center'
            }, {
                field: '联系方式',
                title: '联系方式',
                align: 'center'
            }, {
                field: '资信证明',
                title: '资信证明',
                align: 'center'
            }]
        });
    });