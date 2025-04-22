import json

USERS_PATH = "input/users.json"
CREATE_USER_TEMPLATE_PATH = "input/create_user_template.txt"
DELETE_USER_TEMPLATE_PATH = "input/delete_user_template.txt"
AWS_EXPORTS_PATH = "../ChatApp/src/aws-exports.js"


ADD_USERS_SCRIPT_PATH = "output/create_users.sh"
DELETE_USERS_SCRIPT_PATH = "output/delete_users.sh"


GENERIC_PASSWORD = "1qaz2wsx"


def read_content(path):
    with open(path, mode="r") as input_file:
        return input_file.read()


def read_js_content(path):
    with open(path, mode="r") as input_file:
        data = input_file.read()
        obj = data[data.find('{'): data.rfind('}') + 1]
        return json.loads(obj)


if __name__ == '__main__':
    users = json.loads(read_content(USERS_PATH))["users"]
    create_user_template = read_content(CREATE_USER_TEMPLATE_PATH)
    delete_user_template = read_content(DELETE_USER_TEMPLATE_PATH)
    aws_exports = read_js_content(AWS_EXPORTS_PATH)

    add_users_script_content = ""
    delete_users_script_content = ""

    for user in users:
        email = user + "@student.tuiasi.ro"
        add_users_script_content += "echo 'Add user {}'\n".format(email)
        add_users_script_content += create_user_template.format(email=email,
                                                                password=GENERIC_PASSWORD,
                                                                region=aws_exports["aws_cognito_region"],
                                                                pool_id=aws_exports["aws_user_pools_id"],
                                                                client_id=aws_exports["aws_user_pools_web_client_id"])
        add_users_script_content += "\n\n"

        delete_users_script_content += "echo 'Delete user {}'\n".format(email)
        delete_users_script_content += delete_user_template.format(email=email,
                                                                   region=aws_exports["aws_cognito_region"],
                                                                   pool_id=aws_exports["aws_user_pools_id"])
        delete_users_script_content += "\n\n"

    with open(ADD_USERS_SCRIPT_PATH, mode="w") as output_file:
        output_file.write(add_users_script_content)

    with open(DELETE_USERS_SCRIPT_PATH, mode="w") as output_file:
        output_file.write(delete_users_script_content)
