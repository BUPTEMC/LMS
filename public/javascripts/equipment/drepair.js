    $(document).ready(function() {
        $('#tablepage').bootstrapTable({
            columns: [
            {
                field: 'number',
                title: '序号',
                align: 'center'
            }, {
                field: '送修人员',
                title: '送修人员',
                align: 'center'
            }, {
                field: '送修时间',
                title: '送修时间',
                align: 'center'
            }, {
                field: '送回时间',
                title: '送回时间',
                align: 'center'
            }, {
                field: '维修原因',
                title: '维修原因',
                align: 'center'
            }, {
                field: '验收结果',
                title: '验收结果',
                align: 'center'
            }, {
                field: '验收人员',
                title: '验收人员',
                align: 'center'
            }]
        });
    });