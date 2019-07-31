    $(document).ready(function() {
        $('#tablepage').bootstrapTable({
            columns: [
            {
                field: 'number',
                title: '序号',
                align: 'center'
            }, {
                field: '使用人',
                title: '使用人',
                align: 'center'
            }, {
                field: '开始时间',
                title: '开始时间',
                align: 'center'
            }, {
                field: '终止时间',
                title: '终止时间',
                align: 'center'
            }, {
                field: '测试项目',
                title: '测试项目',
                align: 'center'
            }, {
                field: '使用后检查',
                title: '使用后检查',
                align: 'center'
            }, {
                field: '备注',
                title: '备注',
                align: 'center'
            }]
        });
    });