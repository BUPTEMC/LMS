    $(document).ready(function() {
        $('#tablepage').bootstrapTable({
            columns: [
            {
                field: 'number',
                title: '序号',
                align: 'center'
            }, {
                field: '保养人员',
                title: '保养人员',
                align: 'center'
            }, {
                field: '保养时间',
                title: '保养时间',
                align: 'center'
            }, {
                field: '保养内容',
                title: '保养内容',
                align: 'center'
            }, {
                field: '备注',
                title: '备注',
                align: 'center'
            }]
        });
    });