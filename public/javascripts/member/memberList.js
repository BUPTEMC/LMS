    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '员工工号',
                title: '员工工号',
                align: 'center'
            }, {
                field: '姓名',
                title: '姓名',
                align: 'center'
            }, {
                field: '所在部门',
                title: '所在部门',
                align: 'center'
            }, {
                field: '职务',
                title: '职务',
                align: 'center'
            }]
        });
    });