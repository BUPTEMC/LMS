    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '员工工号',
                title: '员工工号',
                align: 'center'
            }, {
                field: '员工姓名',
                title: '员工姓名',
                align: 'center'
            }, {
                field: '编号',
                title: '编号',
                align: 'center'
            }, {
                field: '培训名称',
                title: '培训名称',
                align: 'center'
            }, {
                field: '时间',
                title: '时间',
                align: 'center'
            }, {
                field: '地点',
                title: '地点',
                align: 'center'
            }, {
                field: '培训内容',
                title: '培训内容',
                align: 'center'
            }, {
                field: '考核结果',
                title: '考核结果',
                align: 'center'
            }]
        });
    });