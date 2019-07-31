    $(document).ready(function() {
        $('#tablepage').bootstrapTable({
            columns: [
            {
                field: 'number',
                title: '序号',
                align: 'center'
            }, {
                field: '取走设备时间',
                title: '取走设备时间',
                align: 'center'
            }, {
                field: '取走原因',
                title: '取走原因',
                align: 'center'
            }, {
                field: '领取人',
                title: '领取人',
                align: 'center'
            }, {
                field: '设备管理员',
                title: '设备管理员',
                align: 'center'
            }, {
                field: '归还时间',
                title: '归还时间',
                align: 'center'
            }, {
                field: '归还时状态',
                title: '归还时状态',
                align: 'center'
            }, {
                field: '验收人员',
                title: '验收人员',
                align: 'center'
            }, {
                field: '备注',
                title: '备注',
                align: 'center'
            }]
        });
    });